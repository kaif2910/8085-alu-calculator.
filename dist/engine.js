(function(root){
'use strict';
const hex=(n,w=8)=>n.toString(16).toUpperCase().padStart(w/4,'0');
const literal=(n,w=8)=>'0'+hex(n,w)+'H';
function flags8(r,cy,ac){return {S:(r>>7)&1,Z:+(r===0),AC:+ac,P:+(r.toString(2).replace(/0/g,'').length%2===0),CY:+cy};}
function byte(a,b,op,c=0){let raw,r,cy=0,ac=0;
 if(op==='ADD'||op==='ADC'){raw=a+b+c;r=raw&255;cy=raw>255;ac=(a&15)+(b&15)+c>15;}
 else if(op==='SUB'||op==='SBB'){raw=a-b-c;r=raw&255;cy=raw<0;ac=(a&15)>=(b&15)+c;}
 else {r=op==='AND'?a&b:op==='OR'?a|b:a^b;ac=op==='AND';}
 return {result:r,flags:flags8(r,cy,ac)};
}
function calculate(a,b,width,op,carry=0){
 if(![8,16].includes(width)||!['ADD','ADC','SUB','SBB','ABS','AND','OR','XOR','NOT'].includes(op))throw Error('Unsupported operation.');
 const max=2**width-1,sign=2**(width-1);if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||a>max||b<0||b>max)throw Error('Operand outside word range.');
 const c=['ADC','SBB'].includes(op)?+!!carry:0;let result,flags,code=[],steps=[],note='Flags describe the 8-bit result. AC is the internal carry from bit 3; for subtraction it is the complement of the low-nibble borrow.',overflow=false;
 const ins={ADD:'ADD B',ADC:'ADC B',SUB:'SUB B',SBB:'SBB B',AND:'ANA B',OR:'ORA B',XOR:'XRA B'};
 const initCarry=c?'STC':'STC\nCMC';
 if(op==='NOT'){result=(~a)&max;flags={S:null,Z:null,AC:null,P:null,CY:null};code=width===8?[`MVI A, ${literal(a)}`,'CMA','HLT']:[`LXI H, ${literal(a,16)}`,'MOV A, L','CMA','MOV L, A','MOV A, H','CMA','MOV H, A','HLT'];note='CMA complements bits and leaves all flags unchanged.';steps=['Load the operand.','Flip every bit: 0 becomes 1 and 1 becomes 0.','Store the complemented value.'];}
 else if(op==='ABS'){
 const signed=a>=sign?a-(max+1):a;result=Math.abs(signed);overflow=a===sign;
 if(width===8){flags=a<sign?byte(a,0,'OR').flags:{...flags8(result,0,((~a)&15)+1>15)};code=[`MVI A, ${literal(a)}`,'ORA A','JP DONE','CMA','INR A','DONE: HLT'];}
 else {flags=a<sign?byte(a>>8,0,'OR').flags:byte(0,a>>8,'SBB',+( (a&255)>0)).flags;code=[`LXI H, ${literal(a,16)}`,'MOV A, H','ORA A','JP DONE','MVI A, 00H','SUB L','MOV L, A','MVI A, 00H','SBB H','MOV H, A','DONE: HLT'];}
 note=width===8?'ABS is a routine, not an 8085 opcode. Flags reflect ORA A (nonnegative) or INR A after CMA (negative).':'ABS is a routine. Flags reflect the final high-byte operation, not a full-word zero or sign test.';
 steps=[`Interpret ${hex(a,width)}H as signed two’s complement: ${signed}.`,signed<0?'Negative input: compute its two’s complement.':'Nonnegative input: keep the original value.',overflow?'Magnitude is valid unsigned, but cannot fit in this signed word size.':`Absolute magnitude is ${result}.`];
 }else if(width===8){const v=byte(a,b,op,c);result=v.result;flags=v.flags;code=[`MVI A, ${literal(a)}`,`MVI B, ${literal(b)}`,...(['ADC','SBB'].includes(op)?[initCarry]:[]),ins[op],'HLT'];steps=[`Load A = ${hex(a)}H and B = ${hex(b)}H.`,`Execute ${ins[op]}${['ADC','SBB'].includes(op)?` with incoming CY = ${c}`:''}.`,`Keep the low 8 bits: ${hex(result)}H. ${flags.CY?'CY is set (carry for addition, borrow for subtraction).':'CY is clear.'}`];
 }else if(op==='ADD'){result=(a+b)&max;flags={S:null,Z:null,AC:null,P:null,CY:+(a+b>max)};code=[`LXI H, ${literal(a,16)}`,`LXI D, ${literal(b,16)}`,'DAD D','HLT'];note='DAD D updates only CY. S, Z, AC, and P are unchanged; — means no initial flag value was supplied.';steps=[`Load HL = ${hex(a,16)}H and DE = ${hex(b,16)}H.`,`DAD D adds the two register pairs.`,`HL = ${hex(result,16)}H; CY = ${flags.CY}.`];
 }else {const sub=['SUB','SBB'].includes(op),lo=byte(a&255,b&255,op,c),highOp=sub?'SBB':op==='ADC'?'ADC':op;const hi=byte(a>>8,b>>8,highOp,(sub||op==='ADC')?lo.flags.CY:0);result=(hi.result<<8)|lo.result;flags=hi.flags;const lowIns=ins[op].replace(/ B$/, ' E'),highIns=ins[highOp].replace(/ B$/, ' D');code=[`LXI H, ${literal(a,16)}`,`LXI D, ${literal(b,16)}`,...(['ADC','SBB'].includes(op)?[initCarry]:[]),'MOV A, L',lowIns,'MOV L, A','MOV A, H',highIns,'MOV H, A','HLT'];note='This is a two-byte routine. Flags reflect the final high-byte instruction; Z does not test the entire 16-bit word.';steps=[`Process low bytes: ${hex(a&255)}H and ${hex(b&255)}H → ${hex(lo.result)}H.`,`${sub?'Propagate borrow':op==='ADC'?'Propagate carry':'Process high bytes'}${sub||op==='ADC'?` (${lo.flags.CY})`:''}: high-byte result = ${hex(hi.result)}H.`,`Combine high and low bytes: HL = ${hex(result,16)}H.`];}
 return {result,flags,code:code.join('\n'),steps,note,overflow};
}
root.ALU={calculate,hex,byte};if(typeof module!=='undefined')module.exports=root.ALU;
})(typeof globalThis!=='undefined'?globalThis:this);

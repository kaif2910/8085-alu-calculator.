(function(root){
class Calculator {
 constructor(){this.width=8;this.base=10;this.carry=false;this.clear();}
 clear(){this.entry='0';this.left=null;this.op=null;this.fresh=false;this.last=null;this.expression='Ready when you are';}
 value(){const n=parseInt(this.entry,this.base)||0;return n<0?n+2**this.width:n;}
 digit(d){if(parseInt(d,16)>=this.base)return;const next=this.fresh||this.entry==='0'?d:this.entry+d;const n=parseInt(next,this.base);if(n>2**this.width-1||n<-(2**(this.width-1)))throw Error(`This ${this.width}-bit number must fit 0–${2**this.width-1} (signed minimum: ${-(2**(this.width-1))}).`);if(this.fresh&&!this.op){this.last=null;this.expression='Ready when you are';}this.entry=next;this.fresh=false;}
 back(){if(this.fresh){this.entry='0';this.fresh=false;if(!this.op){this.last=null;this.expression='Ready when you are';}return;}this.entry=this.entry.slice(0,-1);if(!this.entry||this.entry==='-')this.entry='0';}
 sign(){const v=this.value(),signed=v>=2**(this.width-1)?v-2**this.width:v;if(signed===-(2**(this.width-1)))throw Error('The positive value does not fit the selected signed range.');const n=-signed;this.entry=this.base===10?String(n):((n+2**this.width)%2**this.width).toString(this.base).toUpperCase();this.fresh=false;}
 setBase(base){const v=this.value();this.base=base;this.entry=v.toString(base).toUpperCase();}
 setWidth(width){if(this.value()>2**width-1||(this.left!==null&&this.left>2**width-1))throw Error('Clear the calculator before switching to a smaller word size.');this.width=width;this.last=null;}
 choose(op){if(this.op&&!this.fresh)this.equals();this.left=this.value();this.leftNumeric=parseInt(this.entry,this.base);this.op=op;this.fresh=true;this.expression=`${this.entry} ${Calculator.symbol(op)} …`;}
 equals(){if(!this.op||this.fresh)throw Error('Enter the next number, then press Equals.');const a=this.left,b=this.value(),op=this.carry?(this.op==='ADD'?'ADC':this.op==='SUB'?'SBB':this.op):this.op;this.expression=`${a.toString(this.base).toUpperCase()} ${Calculator.symbol(this.op)} ${this.entry}${['ADC','SBB'].includes(op)?' (incoming 1)':''} =`;this.last=root.ALU.calculate(a,b,this.width,op,+this.carry);if(['ADD','ADC','SUB','SBB'].includes(op)){const first=this.leftNumeric??a,second=parseInt(this.entry,this.base),n=['SUB','SBB'].includes(op)?first-second-(op==='SBB'?1:0):first+second+(op==='ADC'?1:0);this.last.explanation=n===this.last.result?`The answer is ${n}.`:`The full answer is ${n}. In ${this.width}-bit mode, the processor stores ${this.last.result}. The ${['SUB','SBB'].includes(op)?'borrow':'carry'} flag is ${this.last.flags.CY}.`;}this.entry=this.last.result.toString(this.base).toUpperCase();this.op=null;this.left=null;this.fresh=true;return true;}
 unary(op){if(this.op&&this.fresh)throw Error('Enter the second number first.');this.expression=`${op}(${this.entry})`;this.last=root.ALU.calculate(this.value(),0,this.width,op);this.entry=this.last.result.toString(this.base).toUpperCase();if(!this.op)this.fresh=true;}
 static symbol(op){return {ADD:'+',SUB:'−',AND:'AND',OR:'OR',XOR:'XOR'}[op];}
}
root.Calculator=Calculator;if(typeof module!=='undefined')module.exports=Calculator;
})(typeof globalThis!=='undefined'?globalThis:this);

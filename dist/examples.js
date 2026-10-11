(function(root){const examples=[
{name:'Addition',label:'25 + 17 = 42',a:25,b:17,op:'ADD',width:8,expected:42,cy:0},
{name:'Subtraction',label:'50 − 18 = 32',a:50,b:18,op:'SUB',width:8,expected:32,cy:0},
{name:'Carry out',label:'255 + 1 → 0, carry 1',a:255,b:1,op:'ADD',width:8,expected:0,cy:1},
{name:'Incoming carry',label:'10 + 5 + 1 = 16',a:10,b:5,op:'ADC',width:8,expected:16,cy:0},
{name:'Borrow',label:'0 − 1 → 255, borrow 1',a:0,b:1,op:'SUB',width:8,expected:255,cy:1},
{name:'Incoming borrow',label:'10 − 5 − 1 = 4',a:10,b:5,op:'SBB',width:8,expected:4,cy:0},
{name:'16-bit addition',label:'1000 + 2000 = 3000',a:1000,b:2000,op:'ADD',width:16,expected:3000,cy:0},
{name:'Absolute value',label:'ABS(−42) = 42',a:214,b:0,op:'ABS',width:8,expected:42,cy:0},
{name:'Bitwise AND',label:'12 AND 10 = 8',a:12,b:10,op:'AND',width:8,expected:8,cy:0},
{name:'Bitwise OR',label:'12 OR 10 = 14',a:12,b:10,op:'OR',width:8,expected:14,cy:0},
{name:'Bitwise XOR',label:'12 XOR 10 = 6',a:12,b:10,op:'XOR',width:8,expected:6,cy:0},
{name:'Complement',label:'NOT 0 = 255 (8-bit)',a:0,b:0,op:'NOT',width:8,expected:255,cy:null},
{name:'Decimal → binary',label:'25 → 00011001',a:25,width:8,convert:2,expected:'00011001'},
{name:'Decimal → hex',label:'255 → FF',a:255,width:8,convert:16,expected:'FF'}];
function format(n,base,width){return n.toString(base).toUpperCase().padStart(base===2?width:base===16?width/4:1,'0');}
function run(ex){const c=new root.Calculator();c.width=ex.width;c.entry=String(ex.a);if(ex.convert)return {calculator:c,result:format(c.value(),ex.convert,c.width),passed:format(c.value(),ex.convert,c.width)===ex.expected};c.carry=['ADC','SBB'].includes(ex.op);if(['ABS','NOT'].includes(ex.op))c.unary(ex.op);else{c.choose(ex.op==='ADC'?'ADD':ex.op==='SBB'?'SUB':ex.op);for(const d of String(ex.b))c.digit(d);c.equals();}return {calculator:c,result:c.last.result,passed:c.last.result===ex.expected&&c.last.flags.CY===ex.cy};}
root.Examples={examples,format,run};if(typeof module!=='undefined')module.exports=root.Examples;
})(typeof globalThis!=='undefined'?globalThis:this);

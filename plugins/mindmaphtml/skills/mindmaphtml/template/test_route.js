// Blockt jede Anfrage ins Netz und merkt sie sich: Die Seiten müssen komplett offline laufen.
// Nach dem Test steht in route.blocked, was eine Seite nachladen wollte (muss leer sein).
const blocked=[];
module.exports=async(p)=>{await p.route('**/*',r=>{const u=r.request().url();
 if(u.startsWith('file:')||u.startsWith('data:')||u.startsWith('blob:'))return r.continue();blocked.push(u);return r.abort();});};
module.exports.blocked=blocked;

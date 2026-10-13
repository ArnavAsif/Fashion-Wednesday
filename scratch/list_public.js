const fs = require('fs');
function list(dir) {
  let res = [];
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = dir + '/' + f;
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      res = res.concat(list(full));
    } else {
      res.push(full);
    }
  }
  return res;
}
console.log(list('public'));

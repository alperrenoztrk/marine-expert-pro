const fs = require('fs');
const path = require('path');

function bumpPatch(version) {
  const parts = version.split('.').map(Number);
  parts[2] = (parts[2] || 0) + 1;
  return parts.join('.');
}

(function main(){
  const pkgPath = path.resolve(__dirname, '..', 'package.json');
  const mdPath = path.resolve(__dirname, '..', 'LOVABLE_DEPLOYMENT.md');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const oldVer = pkg.version;
  const newVer = bumpPatch(oldVer);
  pkg.version = newVer;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  const now = new Date();
  const dateStr = now.toISOString().slice(0,10);
  let md = fs.readFileSync(mdPath, 'utf8');
  const marker = '## 📋 Son Güncellemeler';
  const idx = md.indexOf(marker);
  if (idx !== -1) {
    const insertIdx = md.indexOf('\n', idx) + 1;
    const note = `- **Tarih:** ${dateStr}\n- **Sürüm:** v${newVer}\n- **Durum:** ✅ Otomatik Lovable güncelleme (squash-merge akışı)\n\n`;
    md = md.slice(0, insertIdx) + note + md.slice(insertIdx);
    fs.writeFileSync(mdPath, md);
  }
  console.log(`Lovable update prepared: ${oldVer} -> ${newVer}`);
})();
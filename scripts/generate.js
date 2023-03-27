const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;

/**
 * 生成 feeds 配置
 * @param {*} name
 * @param {*} uri
 * @param {*} branch
 * @returns
 */
const GenerateFeedsConfig = (name, uri, branch) => {
  exec(`git clone --depth=1 ${uri} -b ${branch} ${name}`);
  const revision = exec(`cd ${name} && git log -1 --pretty=%H`).toString().trim();
  exec(`cd ..`);
  exec(`rm -rf ${name}`);
  return {
    name: name.trim(),
    uri: uri.trim(),
    branch: branch.trim(),
    revision: revision.trim(),
  };
}
// 支持 官方UI 设备
const UIDevices = [
  'target_wlan_ap-gl-ax1800',
  'target_wlan_ap-gl-axt1800',
  // 'target_wlan_ap-gl-ax1800-5-4',
  // 'target_wlan_ap-gl-axt1800-5-4',
  // 'target_ipq40xx_gl-a1300',
  // 'target_mt7981_gl-mt2500',
  // 'target_mt7981_gl-mt3000',
  // 'target_ath79_gl-s200',
]
// 不支持 官方UI 设备
const NotUIDevice = [
  ...UIDevices,
  'target_siflower_gl-sf1200',
  'target_siflower_gl-sft1200',
  'target_ramips_gl-mt1300',
]

/**
 * 生成编译配置文件
 */
const generateYml =() => {
  try {
    exec(`npm install js-yaml`);
    const yaml = require('js-yaml');
    // 生成 feeds 配置
    const feeds = require('./feeds').map(item => GenerateFeedsConfig(item.name, item.uri, item.branch));
    // 生成 packages 配置
    const package = require('./packages');
    const packages = package.map(item => item.name.trim());
    const packagesDesc = package.map((item, index) => `${index + 1}. ${item.desc.trim()}`);

    const profilesPath = path.resolve(process.cwd(), `custom.yml`);


    const yamlStr = yaml.dump({
      feeds,
      packages,
    }, { lineWidth: -1 });

    fs.writeFileSync(profilesPath, yamlStr);

    // 读取 workflow 模板
    let template = fs.readFileSync(path.resolve(__dirname, 'workflow.tpl'), 'utf8');
    template = template.replace(/\$\{releasePackages\}/g, JSON.stringify([
      `## ✨ 主要功能`,
      ...packagesDesc
    ].join('\n')));
    template = template.replace(/\$\{resaseTotal\}/g, [...UIDevices, ...NotUIDevice].length);

    // 替换模板变量
    let ui_tpl = template.replace(/\$\{releaseName\}/g, '官方UI');
    ui_tpl.replace(/\$\{devices\}/g, UIDevices);
    ui_tpl.replace(/\$\{ui\}/g, true);
    let not_ui_tpl = template.replace(/\$\{releaseName\}/g, '非官方UI');
    not_ui_tpl.replace(/\$\{devices\}/g, NotUIDevice);
    not_ui_tpl.replace(/\$\{ui\}/g, false);

    // 写入 workflow
    fs.writeFileSync(path.resolve(process.cwd(), '.github/workflows', `build-glinet-ui.yml`), ui_tpl)
    fs.writeFileSync(path.resolve(process.cwd(), '.github/workflows', `build-glinet.yml`), not_ui_tpl)

  } catch (error) {
    throw error;
  } finally {
     // 清理文件
     exec(`rm -rf gl-infra-builder`);
     require('./feeds').forEach(item => exec(`rm -rf ${item.name}`));
     exec(`rm -rf node_modules`);
     exec(`rm -rf package-lock.json`);
     exec(`rm -rf package.json`);
  }
}

generateYml()
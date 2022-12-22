/**
 * 字段说明
 * @name 工作流文件名 可留空（留空自动生成为 build-glnet-型号）
 * @model 设备型号
 * @config 官方 wlan-ap配置文件名称 profiles 目录下
 * @target 官方 target_wlan_ap 配置文件名称 profiles 目录下
 * @path 官方编译配置文件路径
 * @build 生成自定义的编译文件 可留空（留空自动生成为 glnet-型号）
 */
 module.exports = [
  {
    model: 'ax1800',
    config: 'config-wlan-ap',
    target: 'target_wlan_ap-gl-ax1800',
    path: 'wlan-ap/openwrt',
  },
  {
    model: 'axt1800',
    config: 'config-wlan-ap',
    target: 'target_wlan_ap-gl-axt1800',
    path: 'wlan-ap/openwrt',
  },
  {
    model: 'mt2500',
    config: 'config-mt798x-7.6.6.1',
    target: 'target_mt7981_gl-mt2500',
    path: 'mt7981',
  },
  {
    model: 'mt1300',
    config: 'config-22.03.0',
    target: 'target_ramips_gl-mt1300',
    path: 'openwrt-22.03/openwrt-22.03.0',
  },
  {
    model: 'a1300',
    config: 'config-21.02.2.yml',
    target: 'target_ipq40xx_gl-a1300',
    path: 'openwrt-21.02/openwrt-21.02.2',
  },
  {
    model: 'sf1200',
    config: 'config-siflower-18.x',
    target: 'target_siflower_gl-sf1200',
    path: 'openwrt-18.06/siflower/openwrt-18.06',
  },
  {
    model: 'sft1200',
    config: 'config-siflower-18.x',
    target: 'target_siflower_gl-sft1200',
    path: 'openwrt-18.06/siflower/openwrt-18.06',
  },
  {
    name: 'build-glinet-ax1800-5.4',
    model: 'ax1800',
    config: 'config-wlan-ap-5.4',
    target: 'target_wlan_ap-gl-ax1800-5-4',
    build: 'glinet-ax1800-5-4',
  },
  {
    name: 'build-glinet-axt1800-5.4',
    model: 'axt1800',
    config: 'config-wlan-ap-5.4',
    target: 'target_wlan_ap-gl-axt1800-5-4',
    build: 'glinet-axt1800-5-4',
  },
];

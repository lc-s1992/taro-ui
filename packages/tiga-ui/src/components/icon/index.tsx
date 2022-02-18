import PropTypes, { InferProps } from 'prop-types'
import { Component, createElement } from 'react'
import { AtIconProps } from '../../../types/icon'
import ICONS from './icons'

export default class AtIcon extends Component<AtIconProps> {
  public static defaultProps: AtIconProps
  public static propTypes: InferProps<AtIconProps>

  public render(): JSX.Element | null {
    const { value, color, size, customStyle = {}, style = {} } = this.props

    let inputStyle = style

    // 兼容 style 是数组情况
    if (Array.isArray(style)) {
      inputStyle = style.reduce((sty, obj) => Object.assign(sty, obj), {})
    }

    const fontSize = (customStyle as any).fontSize || inputStyle.fontSize

    const _fontSize =
      parseInt(String(size)) * 2 || fontSize || parseInt('24') * 2

    const _style = {
      width: _fontSize,
      height: _fontSize,
      // tips: 字体转换的 svg 需要沿着 Y 轴旋转 180 度
      transform: [{ rotateY: '180deg' }]
    }

    return createElement(ICONS[value] || ((): any => null), {
      // 图标色值优先级
      fill: color || (customStyle as any).color || inputStyle.color || '',
      style: Object.assign({}, inputStyle, customStyle, _style)
    })
  }
}

AtIcon.defaultProps = {
  style: {},
  customStyle: {},
  className: '',
  prefixClass: 'at-icon',
  value: '',
  color: '',
  size: ''
}

AtIcon.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  prefixClass: PropTypes.string,
  value: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func
}

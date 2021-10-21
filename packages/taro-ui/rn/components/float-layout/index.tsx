import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { ScrollView, Text, View, Image } from '@tarojs/components'
import { Modal, Animated, Dimensions } from 'react-native'
import {
  AtFloatLayoutProps,
  AtFloatLayoutState,
} from '../../../types/float-layout'
import { handleTouchScroll } from '../../common/utils'
import CLOSE from '../../assets/CLOSE.png'

export default class AtFloatLayout extends React.Component<
  AtFloatLayoutProps,
  AtFloatLayoutState
> {
  public static defaultProps: AtFloatLayoutProps
  public static propTypes: InferProps<AtFloatLayoutProps>

  public constructor(props: AtFloatLayoutProps) {
    super(props)

    const { isOpened } = props
    this.state = {
      _isOpened: isOpened,
      translateY: 0,
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: AtFloatLayoutProps): void {
    const { isOpened } = nextProps

    if (this.props.isOpened !== isOpened) {
      handleTouchScroll(isOpened)
    }

    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened,
      })
      if (isOpened) {
        this.setState(
          {
            translateY: new Animated.Value(Dimensions.get('window').height),
          },
          () => {
            Animated.timing(this.state.translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start()
          },
        )
      }
    }
  }

  private handleClose = (): void => {
    if (typeof this.props.onClose === 'function') {
      // TODO: Fix typings
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.props.onClose()
    }
  }

  private close = (): void => {
    this.setState(
      {
        _isOpened: false,
      },
      this.handleClose,
    )
  }

  public render(): JSX.Element {
    const { _isOpened } = this.state
    const {
      title,
      scrollY,
      scrollX,
      scrollTop,
      scrollLeft,
      upperThreshold,
      lowerThreshold,
      scrollWithAnimation,
    } = this.props

    const rootClass = classNames(
      'at-float-layout',
      {
        'at-float-layout--active': _isOpened,
      },
      this.props.className,
    )

    return (
      <Modal
        animationType='none'
        transparent={true}
        visible={_isOpened}
        onRequestClose={this.close.bind(this)}
      >
        <View className={rootClass}>
          <View
            onClick={this.close.bind(this)}
            className='at-float-layout__overlay'
          />
          <Animated.View
            className='at-float-layout__container layout'
            style={{ transform: [{ translateY: this.state.translateY }] }}
          >
            {title ? (
              <View className='layout-header'>
                <Text className='layout-header__title'>{title}</Text>
                <View className='layout-header__btn-close'>
                  <Image
                    src={CLOSE}
                    onClick={this.close.bind(this)}
                    className='layout-header__btn-close'
                  />
                </View>
              </View>
            ) : null}
            <View className='layout-body'>
              <ScrollView
                scrollY={scrollY}
                scrollX={scrollX}
                scrollTop={scrollTop}
                scrollLeft={scrollLeft}
                upperThreshold={upperThreshold}
                lowerThreshold={lowerThreshold}
                scrollWithAnimation={scrollWithAnimation}
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore // TODO: Fix typings
                onScroll={this.props.onScroll}
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore // TODO: Fix typings
                onScrollToLower={this.props.onScrollToLower}
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore // TODO: Fix typings
                onScrollToUpper={this.props.onScrollToUpper}
                className='layout-body__content'
              >
                {this.props.children}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>
    )
  }
}

AtFloatLayout.defaultProps = {
  title: '',
  isOpened: false,

  scrollY: true,
  scrollX: false,
  scrollWithAnimation: false,
}

AtFloatLayout.propTypes = {
  title: PropTypes.string,
  isOpened: PropTypes.bool,
  scrollY: PropTypes.bool,
  scrollX: PropTypes.bool,
  scrollTop: PropTypes.number,
  scrollLeft: PropTypes.number,
  upperThreshold: PropTypes.number,
  lowerThreshold: PropTypes.number,
  scrollWithAnimation: PropTypes.bool,
  onClose: PropTypes.func,
  onScroll: PropTypes.func,
  onScrollToLower: PropTypes.func,
  onScrollToUpper: PropTypes.func,
}

import React from 'react'
import styled from 'styled-components'

interface WrapperPropsType {
  size?: number
  color?: string
}

const Wrapper = styled.div<WrapperPropsType>`
  display: inline-block;
  vertical-align: middle;
  animation: 0.8s linear infinite spinner;
  border-bottom: 2px solid transparent;
  border-radius: 50%;
  border-right: 2px solid transparent;
  border-left: 2px solid ${(props) => props.color || 'currentColor'};
  border-top: 2px solid ${(props) => props.color || 'currentColor'};
  box-sizing: border-box;
  height: ${(props) => `${props.size || 20}px`};
  width: ${(props) => `${props.size || 20}px`};

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

interface SpinnerPropsType extends React.ComponentPropsWithoutRef<'div'> {
  color?: string
  className?: string
  size?: number
}

const Spinner: React.FC<SpinnerPropsType> = ({ size, color, className }) => {
  return <Wrapper size={size} color={color} className={className} />
}

export default Spinner

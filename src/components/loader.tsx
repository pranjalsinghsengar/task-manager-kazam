interface Load {
  color: string;
  className: string;
}

const Loader = ({ color, className }: Load) => {
  return (
    <div
      className={`${className} absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}
    >
      <svg viewBox='0 0 200 200'>
        <circle
          fill={color ? color : "#8525f9"}
          stroke={color ? color : "#8525f9"}
          stroke-width='15'
          r='15'
          cx='40'
          cy='100'
        >
          <animate
            attributeName='opacity'
            calcMode='spline'
            dur='2'
            values='1;0;1;'
            keySplines='.5 0 .5 1;.5 0 .5 1'
            repeatCount='indefinite'
            begin='-.4'
          />
        </circle>
        <circle
          fill={color ? color : "#8525f9"}
          stroke={color ? color : "#8525f9"}
          stroke-width='15'
          r='15'
          cx='100'
          cy='100'
        >
          <animate
            attributeName='opacity'
            calcMode='spline'
            dur='2'
            values='1;0;1;'
            keySplines='.5 0 .5 1;.5 0 .5 1'
            repeatCount='indefinite'
            begin='-.2'
          />
        </circle>
        <circle
          fill={color ? color : "#8525f9"}
          stroke={color ? color : "#8525f9"}
          stroke-width='15'
          r='15'
          cx='160'
          cy='100'
        >
          <animate
            attributeName='opacity'
            calcMode='spline'
            dur='2'
            values='1;0;1;'
            keySplines='.5 0 .5 1;.5 0 .5 1'
            repeatCount='indefinite'
            begin='0'
          />
        </circle>
      </svg>
    </div>
  );
};

export const SpinLoader = ({ color, className }: Load) => {
  return (
    <div
      className={`${className} absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}
    >
      <svg viewBox='0 0 200 200'>
        <radialGradient
          id='a12'
          cx='.66'
          fx='.66'
          cy='.3125'
          fy='.3125'
          gradientTransform='scale(1.5)'
        >
          <stop offset='0' stop-color={color ? color : "#FF156D"}></stop>
          <stop
            offset='.3'
            stop-color={color ? color : "#FF156D"}
            stop-opacity='.9'
          ></stop>
          <stop
            offset='.6'
            stop-color={color ? color : "#FF156D"}
            stop-opacity='.6'
          ></stop>
          <stop
            offset='.8'
            stop-color={color ? color : "#FF156D"}
            stop-opacity='.3'
          ></stop>
          <stop
            offset='1'
            stop-color={color ? color : "#FF156D"}
            stop-opacity='0'
          ></stop>
        </radialGradient>
        <circle
          transform-origin='center'
          fill='none'
          stroke='url(#a12)'
          stroke-width='15'
          stroke-linecap='round'
          stroke-dasharray='200 1000'
          stroke-dashoffset='0'
          cx='100'
          cy='100'
          r='70'
        >
          <animateTransform
            type='rotate'
            attributeName='transform'
            calcMode='spline'
            dur='2'
            values='360;0'
            keyTimes='0;1'
            keySplines='0 0 1 1'
            repeatCount='indefinite'
          ></animateTransform>
        </circle>
        <circle
          transform-origin='center'
          fill='none'
          opacity='.2'
          stroke={color ? color : "#FF156D"}
          stroke-width='15'
          stroke-linecap='round'
          cx='100'
          cy='100'
          r='70'
        ></circle>
      </svg>
    </div>
  );
};
export default Loader;

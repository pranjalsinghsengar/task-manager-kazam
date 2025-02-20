interface Load {
  color: string;
  className: string;
}

const Loader = ({ color, className }: Load) => {
  return (
    <div className={`${className} absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}>
      <svg viewBox='0 0 200 200'>
        <circle
          fill={color ? color :"#8525f9"}
          stroke={color ? color :"#8525f9"}
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
          fill={color ? color :"#8525f9"}
          stroke={color ? color :"#8525f9"}
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
          fill={color ? color :"#8525f9"}
          stroke={color ? color :"#8525f9"}
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

export default Loader;

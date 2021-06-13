import React from "react";

export default function DownloadIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      version="1.1"
      width="24"
      height="24"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M426.635,164.217C402.969,69.94,307.358,12.698,213.08,36.364C139.404,54.858,85.907,118.535,80.395,194.297
				c-52.313,8.627-87.728,58.028-79.101,110.341c7.669,46.507,47.967,80.566,95.101,80.379h64v-32h-64c-35.346,0-64-28.654-64-64
				c0-35.346,28.654-64,64-64c8.837,0,16-7.163,16-16c-0.08-79.529,64.327-144.065,143.856-144.144
				c68.844-0.069,128.107,48.601,141.424,116.144c1.315,6.744,6.788,11.896,13.6,12.8c43.742,6.229,74.151,46.738,67.923,90.479
				c-5.593,39.278-39.129,68.523-78.803,68.721h-48v32h48c61.856-0.187,111.848-50.483,111.66-112.339
				C511.899,221.187,476.655,176.437,426.635,164.217z"
        fill="currentcolor"
        />
        <path
          d="M272.395,426.457v-153.44h-32v153.44l-36.64-36.64l-22.56,22.56l64,64c6.241,6.204,16.319,6.204,22.56,0l64-64
				l-22.56-22.56L272.395,426.457z"
        fill="currentcolor"
        />
      </g>
    </svg>
  );
}

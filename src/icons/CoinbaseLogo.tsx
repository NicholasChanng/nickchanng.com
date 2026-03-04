const coinbaseBlue = "#0052FF";

export const CoinbaseLogo = () => (
  <svg
    height="18"
    viewBox="2 2 28 28"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <path
      d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 5.25c4.832 0 8.75 3.918 8.75 8.75s-3.918 8.75-8.75 8.75S7.25 20.832 7.25 16 11.168 7.25 16 7.25z"
      fill={coinbaseBlue}
      fillRule="evenodd"
      clipRule="evenodd"
    />
    <circle cx="16" cy="16" r="8.75" fill="#FFFFFF" />
    <circle cx="16" cy="16" r="4.2" fill={coinbaseBlue} />
    <rect
      x="16"
      y="14.7"
      width="9.5"
      height="2.6"
      rx="1.3"
      fill={coinbaseBlue}
    />
  </svg>
);

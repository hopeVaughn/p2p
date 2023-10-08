import MainLogo from "../../assets/HeadLogo.svg";
type LogoProps = {
  color?: string;
  size?: number | string;
};

export default function Logo({ color = 'black', size = 'auto' }: LogoProps) {
  return (
    <img
      src={MainLogo}
      alt="mother monster head logo"
      className={`h-${size} w-auto text-${color} fill-current`}
    />
  );
}
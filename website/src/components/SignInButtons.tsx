import SvgMetamask from "./svg/SvgMetamask";
// import SvgAlchemy from "./svg/SvgAlchemy";

import SignInButton from "./SignInButton";

const SignInButtons = () => {
  return (
    <div class={`sign-in-buttons`}>
      <SignInButton icon={<SvgMetamask />} text={"Sign in with Metamask"} />
      {/* <SignInButton icon={<SvgAlchemy />} text={"Sign in with Alchemy"} /> */}
    </div>

  );
};

export default SignInButtons;

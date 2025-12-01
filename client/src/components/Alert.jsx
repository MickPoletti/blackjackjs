import { useSpring, animated } from "react-spring";

export default function Alert({ message }) {
  const slideDown = useSpring({
    from: { transform: "translateY(-100%)" },
    to: { transform: "translateY(0)" },
    config: { duration: 1500 },
  });

  const fadeOut = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: 2000,
    config: { duration: 500 },
  });

  return (
    <animated.div
      style={{ ...slideDown, ...fadeOut }}
      className="flex h-1/3 w-52 border-2 border-lime-400 bg-zinc-900 rounded-md"
    >
      <img
        className=""
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.tumblr.com%2Fca2a5ea5da00cafb3a817d91ce1282d2%2Fl0hgvj0%2Fb6to5v9ed%2Ftumblr_static_80a0vnv5tm4ow8c44kk488c0w.png&f=1&nofb=1&ipt=8f910abb7ba89fe98cc2838a108d3a10b1e3c3300a76ab4a4da9d8f03a248ed2&ipo=images"
        alt="Vault Boy"
      />
      <div className="flex-wrap justify-center items-center py-5 px-4">
        <h1 className="font-bold text-slate-200">{message}</h1>
      </div>
    </animated.div>
  );
}

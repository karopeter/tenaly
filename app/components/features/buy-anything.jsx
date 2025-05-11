import Img from "../Image";

export default function BuyAnything() {
  return (
    <div className="flex justify-center mt-10 px-4">
      <Img
        src="/buyAnything.svg"
        alt="Buy Anything"
        width={1138}
        height={371}
        className="w-full h-auto max-w-[1138px]"
      />
    </div>
  );
}

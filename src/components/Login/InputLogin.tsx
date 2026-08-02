export default function InputLogin({
  placeholderVal,
  name,
  type = "text",
}: {
  placeholderVal: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col font-black">
        {name}
        <input className="font-normal px-1 border-b-1 border-purple-200" type={type} placeholder={placeholderVal} name={name} />
    </label>
  )
}

import GraphicButton from "../components/GraphicButton";

export default function Visuals() {
  const compList = [
    {
      key: "GraphicButton [buttonStyle: red]",
      value: <GraphicButton text="Text" buttonStyle="red">*</GraphicButton>
    },
    {
      key: "GraphicButton [buttonStyle: red, no text]",
      value: <GraphicButton buttonStyle="red">*</GraphicButton>
    },
    {
      key: "GraphicButton [buttonStyle: blue]",
      value: <GraphicButton text="Text" buttonStyle="red" disabled={true}>
        <span className="material-symbols-outlined">
          delete
        </span></GraphicButton>
    },
    {
      key: "GraphicButton [buttonStyle: blue, no text]",
      value: <GraphicButton buttonStyle="red" disabled={true}>
        <span className="material-symbols-outlined">
          delete
        </span></GraphicButton>
    },
    {
      key: "GraphicButton [buttonStyle: blue]",
      value: <GraphicButton text="Text" buttonStyle="blue">
        <span className="material-symbols-outlined">
          delete
        </span></GraphicButton>
    },
    {
      key: "GraphicButton [buttonStyle: blue, no text]",
      value: <GraphicButton buttonStyle="blue">
        <span className="material-symbols-outlined">
          delete
        </span></GraphicButton>
    },
    {
      key: "GraphicButton [buttonStyle: blue]",
      value: <GraphicButton text="Text" buttonStyle="blue" disabled={true}>
        <span className="material-symbols-outlined">
          delete
        </span>
      </GraphicButton>
    },
    {
      key: "GraphicButton [buttonStyle: blue, no text]",
      value: <GraphicButton buttonStyle="blue" disabled={true}>
        <span className="material-symbols-outlined">
          delete
        </span>
      </GraphicButton>
    },
    {
      key: "GraphicButton [buttonStyle: safe, no text]",
      value:
        <GraphicButton
          buttonStyle="greenline"
          disabled={true}
        ><span className="material-symbols-outlined">
            delete
          </span></GraphicButton>
    }
  ]

  return (
    <div className="w-full p-4 mt-16 m-4">
      <div className="flex flex-col justify-center h-full flex-grow">
        <div className={`my-4 grid gap-x-4 gap-y-8 grid-cols-4`} >
          {
            compList.map((item, index) =>
              <div
                key={index}
                className="px-2 flex flex-col flex-grow items-start justify-center">
                <div className="text-xs font-semibold text-gray-500">{item.key}</div>
                <div className="text-md">{item.value ? item.value : emptyFieldText}</div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

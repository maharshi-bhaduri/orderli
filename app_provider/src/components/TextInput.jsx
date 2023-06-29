import React from "react";

export default function TextInput(props) {

    const handleChange = (event) => {
        props.onChange({
            name: props.name,
            value: event.target.value
        });
    };

    return (
        <label className="my-4 text-2xl">
            {props.labelName}
            <div className="mt-1">
                {props.prependText}
                <div className="inline">
                    {
                        props.multiLine ?
                            <textarea
                                placeholder={props.inputHint}
                                name="providerName"
                                className={"h-20 text-2xl focus:text-3xl resize-none border-b-2 focus:border-b-4" +
                                    " focus:border-orderlee-primary-200 w-full transition-all duration-100 outline-none"}
                                onChange={handleChange}
                                value={props.value}
                            />
                            :
                            <input
                                type="text"
                                placeholder={props.inputHint}
                                name="providerName"
                                className={"h-20 pt-4 text-2xl focus:text-4xl border-b-2 focus:border-b-4" +
                                    " focus:border-orderlee-primary-200 transition-all duration-100 outline-none"}
                                onChange={handleChange}
                                value={props.value}
                            />
                    }
                </div>
            </div>
        </label>
    );
}

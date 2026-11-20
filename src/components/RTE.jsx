import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

// User writes blog content in RTE
// TinyMCE detects the content change
// Controller passes updated content to React Hook Form
// handleSubmit() includes content in data

// Remember this one line:
// - register → React Hook Form directly manages a normal input.
// - control + Controller → React Hook Form manages a custom input through a bridge.
// Both ultimately put their values into the same form data object when you call handleSubmit().

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            initialValue="default value"
            init={{
              branding: false,
              height: 500,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste help wordcount",
              ],
              toolbar:
                "undo redo|formatselect|bold italic backcolor|\ alignleft aligncenter alignright alignjustify |\bullist numlist outdent indent | removeforamt | help",
              content_style:
                "body{font-family:Helvetica,Arial,sans-serif;font-size:14px}",
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}

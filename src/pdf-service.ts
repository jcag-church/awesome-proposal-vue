import { PDFDocument, TextAlignment } from "pdf-lib";

interface FormFieldsBase {
	name: string;
	ministry: string;
	objective: string;
	participants: string;
	venue: string;
	equipment?: string;
	event_date: string;
	other_support?: string;
	overseer: string;
}

type FormFields = FormFieldsBase & (withBudget | withoutBudget);

type withBudget = {
	needBudget: boolean;
	budget: string;
};

type withoutBudget = {
	needBudget: boolean;
};

export const getDoc = async (url: string) => {
	const existingPdfBytes = await fetch(url);
	const arrayBuffer = await existingPdfBytes.arrayBuffer();
	const pdfDoc = await PDFDocument.load(arrayBuffer, {
		// ignoreEncryption: true,
	});
	return pdfDoc;
};

export const fillForm = async (field: FormFields) => {
	const doc = await getDoc("prop.pdf");
	const form = await doc.getForm();
	const fields = Object.keys(field) as unknown as keyof FormFields[];
	for (const f in fields) {
		// form.getFieldMaybe(fields[f])
		if (fields[f] !== "needBudget") {
			const textField = form.getTextField(fields[f]);
			textField.setFontSize(13);
			fields[f] === "overseer" && textField.setAlignment(TextAlignment.Center);
			textField.setText(field[fields[f]]);
			console.log(fields[f], "value", field[fields[f]]);
		} else {
			if (field.needBudget) {
				form.getCheckBox("cb_budget_yes").check();
			} else {
				form.getCheckBox("cb_budget_no").check();
			}
		}
	}

	const pdfBytes = await doc.save();
	return pdfBytes;
};

export const saveForm = async (
	form: Uint8Array<ArrayBufferLike>,
	filename: string,
) => {
	const blob = new Blob([await form]);
	const fileUrl = window.URL.createObjectURL(blob);

	const alink = document.createElement("a");
	alink.href = fileUrl;
	alink.download = `${filename}.pdf`;
	alink.click();
};

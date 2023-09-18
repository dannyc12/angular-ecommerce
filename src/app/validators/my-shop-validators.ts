import { FormControl, ValidationErrors } from "@angular/forms";

export class MyShopValidators {

    // whitespace validation
    static notOnlyWhiteSpace(control: FormControl) : ValidationErrors {
        // check if string only contains white spaces
        if ((control.value != null) && (control.value.trim().length === 0)) {
            // invalid, return error object
            return { 'notOnlyWhiteSpace': true };
        } // valid
        else { return null; }
        
    }
}

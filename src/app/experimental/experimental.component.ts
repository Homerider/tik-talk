import { Component, inject } from '@angular/core'
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

enum ReceiverType {
	PERSON = 'PERSON',
	LEGAL = 'LEGAL'
}

function getAddressForm() {
	return new FormGroup({
		city: new FormControl<string>(''),
		street: new FormControl<string>(''),
		building: new FormControl<number | null>(null),
		apartment: new FormControl<number | null>(null)
	})
}

@Component({
	selector: 'app-experimental',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './experimental.component.html',
	styleUrl: './experimental.component.scss'
})
export class ExperimentalComponent {
	#fb = inject(FormBuilder)

	ReceiverType = ReceiverType

	// form = new FormGroup({
	//   type: new FormControl<ReceiverType>(ReceiverType.PERSON),
	//   name: new FormControl<string>('', Validators.required),
	//   inn: new FormControl<string>(''),
	//   lastName: new FormControl<string>('ЗНАЧЕНИЕ'),
	//   address: getAddressForm()
	// })

	form = this.#fb.group({
		type: this.#fb.control<ReceiverType>(ReceiverType.PERSON),
		name: this.#fb.nonNullable.control<string>('Lucas'),
		inn: this.#fb.control<string>('fsdfsdfsd'),
		lastName: this.#fb.control<string>('dsfasdf'),
		address: this.#fb.group({
			city: this.#fb.control<string>(''),
			street: this.#fb.control<string>(''),
			building: this.#fb.control<number | null>(null),
			apartment: this.#fb.control<number | null>(null)
		})
	})

	constructor() {
		this.form.controls.type.valueChanges
			.pipe(takeUntilDestroyed())
			.subscribe((val) => {
				this.form.controls.inn.clearValidators()

				if (val === ReceiverType.LEGAL) {
					this.form.controls.inn.setValidators([
						Validators.required,
						Validators.minLength(10),
						Validators.maxLength(10)
					])
				}
			})
	}

	onSubmit(event: SubmitEvent) {
		this.form.reset()
		//   this.form.markAllAsTouched()
		//   this.form.updateValueAndValidity()
		//   if (this.form.invalid) return
		//
		//   console.log('this.form.value', this.form.value);
		//   console.log('getRawValue', this.form.getRawValue());
	}
}

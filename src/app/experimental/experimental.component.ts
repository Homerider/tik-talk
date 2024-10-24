import { AfterViewInit, Component, inject } from '@angular/core'
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
	selector: 'app-experimental',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './experimental.component.html',
	styleUrl: './experimental.component.scss'
})
export class ExperimentalComponent implements AfterViewInit {
	selectElement!: HTMLSelectElement

	form = new FormGroup({})

	onSubmit(event: SubmitEvent) {
		console.log(event)
	}

	ngAfterViewInit() {
		// Эта функция позволяет динамически изменять цвет текста в элементе <select>
		this.selectElement = document.getElementById('tvType') as HTMLSelectElement
		// мы ищем элемент с идентификатором tvType в документе и приводим его к типу HTMLSelectElement.
		// Это позволяет нам работать с элементом <select>

		this.selectElement.addEventListener('change', () => {
			// Мы добавляем обработчик события change для элемента <select>
			if (this.selectElement.value) {
				this.selectElement.style.color = 'var(--light-color)' // Цвет при выборе
			}
		})
	}

	protected readonly onsubmit = onsubmit
}

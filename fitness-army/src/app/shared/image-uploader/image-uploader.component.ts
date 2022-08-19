import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, FormGroup} from "@angular/forms";

@Component({
  selector: 'fitness-army-app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  @Input() controlName!: string;
  @Output() selectedImage: EventEmitter<File> = new EventEmitter<File>();
  parentFormGroup!: any;

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.parentFormGroup = this.controlContainer.control;
  }

  processFile(imageInput: Event): void {
    const imageUploaderInput = (<HTMLInputElement>imageInput.target);
    if (imageUploaderInput.files?.length) {
      const imageFile: File = imageUploaderInput.files[0];
      this.selectedImage.next(imageFile);
    }
  }
}

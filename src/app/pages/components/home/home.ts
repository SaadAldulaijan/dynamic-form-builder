import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SchemaService } from '../../services/schema';
import { Schema } from '../../models/schema';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {

  private schemaService = inject(SchemaService);

  // schemas: Schema[] = [];
  schemas = signal<Schema[]>([]);

  ngOnInit(): void {
    this.schemaService.getSchemaList().subscribe((schemas) => {
      this.schemas.set(schemas);
    });
  }

}

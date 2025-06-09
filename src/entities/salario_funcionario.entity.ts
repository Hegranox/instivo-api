import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class SalarioFuncionario {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  salarioBruto: number;

  @Column()
  salarioLiquido: number;

  @Column()
  dataAdmissao: Date;

  @Column()
  diasDecorridosAdmissao: number;

  @Column()
  mesesDecorridosAdmissao: number;

  @Column()
  anosDecorridosAdmissao: number;
}

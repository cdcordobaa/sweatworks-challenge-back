import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Publication } from './Publication';

@Entity()
export class Author {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    photo?: string;

    @Column({ nullable: true })
    birth_date?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToMany(
        () => Publication,
        publication => publication.authors,
    )
    publications: Publication[];
}

import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    DeleteDateColumn,
} from 'typeorm';
import { Author } from './Author';

@Entity()
export class Publication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column()
    publication_date: string;

    @Column({ nullable: true })
    picture?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToMany(
        () => Author,
        author => author.publications,
        { cascade: true },
    )
    @JoinTable()
    authors: Author[];
}

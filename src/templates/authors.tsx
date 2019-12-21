import * as React from 'react'
import { StrapiAuthor } from '../../graphql-types';

interface AuthorDisplayProps {
    data: StrapiAuthor
}

export class AuthorDisplay extends React.Component<AuthorDisplayProps, {}> {
    constructor(props: AuthorDisplayProps, context: {}) {
        super(props, context);
    }
    public render(): JSX.Element {
        const { data } = this.props;
        return <span className='paper-author'>{`${data.given_name} ${data.family_name}`}</span>
    }
}

interface AuthorListDisplayProps {
    authors: ReadonlyArray<StrapiAuthor>
}
export class AuthorListDisplay extends React.Component<AuthorListDisplayProps, {}> {
    constructor(props: AuthorListDisplayProps, context: {}) {
        super(props, context);
    }

    public render(): JSX.Element {
        const { authors } = this.props;
        const authorDisplays:(string | JSX.Element)[] = authors.map((a) => <AuthorDisplay key={a.id} data={a} />)
        if (authorDisplays.length === 2) {
            authorDisplays.splice(1, 0, ' and ');
        } else if (authorDisplays.length > 2) {
            authorDisplays.splice(authorDisplays.length-1, 0, ', and ');
            for(let i: number = authorDisplays.length-3; i>0; i--) {
                authorDisplays.splice(i, 0, ', ');
            }
        }

        return <span className='paper-author-list'>{authorDisplays}</span>;
    }
}
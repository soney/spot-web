import Img from 'gatsby-image';
import Link from 'gatsby-link';
import * as React from 'react';
import { StrapiAuthor } from '../../graphql-types';

interface MemberListDisplayProps {
    data: ReadonlyArray<StrapiAuthor>,
    highlightPubs: boolean
}

export class MemberListDisplay extends React.Component<MemberListDisplayProps, {}> {
    constructor(props: MemberListDisplayProps, context: {}) {
        super(props, context)
    }
    public render() {
        const { data } = this.props;
        const memberDisplays = data.map((node: StrapiAuthor) => (
            <div key={node.id} className="col col-"><MemberDisplay highlightPubs={this.props.highlightPubs} data={node} /></div>
        ));
        return <div className="container">
            <div className="row">
                {memberDisplays}
            </div>
        </div>;
    }
}

interface MemberDisplayProps {
    data: StrapiAuthor,
    highlightPubs: boolean
}

class MemberDisplay extends React.Component<MemberDisplayProps, {}> {
    constructor(props: MemberDisplayProps, context: {}) {
        super(props, context);
    }
    private pubListElements: ChildNode[];
    public render(): JSX.Element {
        const { data } = this.props;
        const { strapiId, given_name, family_name, short_bio } = data;
        const color = data.color || '#FFFF00';
        const memberContent: JSX.Element[] = [
            <Img className="member-headshot" fluid={data.headshot.childImageSharp.fluid as any} alt={`Headshot of ${given_name} ${family_name}`} />,
            <div>
                <span className="member-name">{`${given_name} ${family_name}`}</span>
            </div>,
            <div className="member-short-bio">{short_bio}</div>
        ];

        const highlightMember = () => {
            if(this.props.highlightPubs) {
                const pubList = document.querySelector('.publication-list');
                this.pubListElements = Array.from(pubList.childNodes);
                const memberElement: Element = document.querySelector(`.member-display[data-member-id='${strapiId}'] .member-name`);
                if(memberElement) {
                    memberElement.classList.add('hover-highlight');
                    memberElement.setAttribute('style', `background-color: ${color}`);
                }

                const paperRows = document.querySelectorAll('.paper');
                const relevantPaperRows: Element[] = [];
                const notRelevantPaperRows: Element[] = [];
                for(let i: number = 0; i<paperRows.length; i++) {
                    const row = paperRows.item(i);
                    const authors = row.getAttribute('data-authors')
                    const authorIDs = authors.split(',').map((a) => parseInt(a));
                    if(authorIDs.indexOf(strapiId) >= 0) {
                        relevantPaperRows.push(row);
                    } else {
                        notRelevantPaperRows.push(row);
                    }
                }

                relevantPaperRows.forEach((el: Element) => {
                    el.classList.add('hover-highlight');
                });
                notRelevantPaperRows.forEach((el: Element) => {
                    el.classList.add('hover-no-highlight');
                    el.setAttribute('style', `opacity: 0.4`);
                    const li=el.parentElement;
                    li.parentElement.append(li);
                });

                const authorElements = document.querySelectorAll(`.paper-author[data-author-id='${strapiId}']`);

                authorElements.forEach((el) => {
                    el.classList.add('hover-highlight');
                    el.setAttribute('style', `background-color: ${color}`);
                });
            }
        };
        const unhighlightMember = () => {
            if(this.props.highlightPubs) {
                const pubList = document.querySelector('.publication-list');
                this.pubListElements.forEach((el) => {
                    pubList.append(el);
                })
                const memberElement = document.querySelector(`.member-display .member-name.hover-highlight`);
                if(memberElement) {
                    memberElement.classList.remove('hover-highlight');
                    memberElement.removeAttribute('style');
                }

                const relevantPaperRows = document.querySelectorAll(`.paper.hover-highlight,.paper.hover-no-highlight`);
                relevantPaperRows.forEach((el) => {
                    el.classList.remove('hover-highlight');
                    el.classList.remove('hover-no-highlight');
                    el.removeAttribute('style');
                });
                const authorElements = document.querySelectorAll(`.paper-author.hover-highlight`);
                authorElements.forEach((el) => {
                    el.classList.remove('hover-highlight');
                    el.removeAttribute('style');
                });
            }
        };

        if(data.membership === 'lead') {
            return <Link onMouseEnter = {highlightMember} onMouseLeave = {unhighlightMember} className="member-display" data-member-id={strapiId} to={`/${data.given_name}_${data.family_name}`}>{memberContent}</Link>;
        } else {
            return <a onMouseEnter={highlightMember} onMouseLeave={unhighlightMember} className="member-display" data-member-id={strapiId} href={data.homepage} target="_blank">{memberContent}</a>;
        }
    }
}
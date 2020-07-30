import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const nodes = [{
    value: 'mars',
    label: 'Mars',
    children: [
        { value: 'phobos', label: 'Phobos' },
        { value: 'deimos', label: 'Deimos' },
        //{ value: 'mars'  , label: 'Mars'},
    ]},
    {
        value: 'venus',
        label: 'Venus',
        children: [
            { value: 'phobos', label: 'Phobos' },
            { value: 'deimos', label: 'Deimos' },      //{ value: 'mars'  , label: 'Mars'},
        ]
    }];

export default class NestedCheckBox extends React.Component {
    state = {
        checked: [],
        expanded: [],
    };

    render() {
        return (
            <CheckboxTree
                nodes={nodes}
                checked={this.state.checked}
                expanded={this.state.expanded}
                onCheck={checked => this.setState({ checked })}
                onExpand={expanded => this.setState({ expanded })}
            />
        );
    }
}

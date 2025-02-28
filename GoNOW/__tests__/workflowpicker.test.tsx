import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import WorkflowPicker from '../app/components/WorkflowPicker';
import { Workflow } from '../app/models/Workflow';
import { Time } from '../app/models/Time';
import { SchedulingStyle } from '../app/models/SchedulingStyle';

const mockWorkflows: Workflow[] = [
  new Workflow(1, 'Workflow 1', '#FF0000', true, new Time(9, 0), new Time(17, 0), [true, false, true, false, true, false, true], new SchedulingStyle(1, 'Style A')),
  new Workflow(2, 'Workflow 2', '#00FF00', false, new Time(10, 0), new Time(18, 0), [false, true, false, true, false, true, false], new SchedulingStyle(2, 'Style B')),
];

describe('WorkflowPicker', () => {
  // it('renders correctly', () => {
  //   const { getByText } = render(
  //     <WorkflowPicker workflows={mockWorkflows} onSelect={jest.fn()} />
  //   );
  //   // expect(getByText('Select workflow')).toBeTruthy();
  //   expect(getByText('Workflow 1')).toBeTruthy();
  //   expect(getByText('Workflow 2')).toBeTruthy();
  // });

  // it('calls onSelect when a workflow is selected', () => {
  //   const mockOnSelect = jest.fn();
  //   const { getByText } = render(
  //     <WorkflowPicker workflows={mockWorkflows} onSelect={mockOnSelect} />
  //   );
  //   fireEvent(getByText('Workflow 1'), 'onValueChange', 1);
  //   expect(mockOnSelect).toHaveBeenCalledWith(1);
  // });
});

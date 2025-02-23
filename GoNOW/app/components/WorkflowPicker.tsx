import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { Workflow } from '../models/Workflow';
import { WorkflowPickerStyles } from '../styles/WorkflowPickerStyles';

interface WorkflowPickerProps {
  workflows: Workflow[];
  onSelect: (workflow_name: string) => void;
}

const WorkflowPicker: React.FC<WorkflowPickerProps> = ({
  workflows,
  onSelect
}) => { 
  const [selectedWorkflowName, setSelectedWorkflowName] = React.useState<string>('');
  return (
    <View style={WorkflowPickerStyles.container}>
      <Picker
        style={{color: 'black', opacity:100}}
        selectedValue={selectedWorkflowName}
        onValueChange={(itemValue) => {
          setSelectedWorkflowName(itemValue);
          if (itemValue) {
            onSelect(itemValue);
          }
        }}
      >
        <Picker.Item key="None Selected" label="Select a workflow..."  />
        {workflows.map((workflow) => (
          <Picker.Item key={workflow.name} label={workflow.name} value={workflow.name} style={WorkflowPickerStyles.resultItem} />
        ))}
      </Picker>
    </View>
  );
};

export default WorkflowPicker;
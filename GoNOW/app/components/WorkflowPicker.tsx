import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { Workflow } from '../models/Workflow';
import { WorkflowPickerStyles } from '../styles/WorkflowPickerStyles';

interface WorkflowPickerProps {
  workflows: Workflow[];
  onSelect: (workflow_id: number) => void;
}

const WorkflowPicker: React.FC<WorkflowPickerProps> = ({
  workflows,
  onSelect
}) => { 
  const [selectedWorkflowID, setSelectedWorkflowID] = React.useState<number>(-1)
  return (
    <View style={WorkflowPickerStyles.container}>
      <Picker
        style={{color: 'black', opacity:100}}
        selectedValue={selectedWorkflowID}
        onValueChange={(itemValue) => {
          setSelectedWorkflowID(itemValue);
          if (itemValue) {
            onSelect(itemValue);
          }
        }}
      >
        <Picker.Item key="None Selected" label="Select a workflow..."  />
        {workflows.map((workflow) => (
          <Picker.Item key={workflow.name} label={workflow.name} value={workflow.id} style={WorkflowPickerStyles.resultItem} />
        ))}
      </Picker>
    </View>
  );
};

export default WorkflowPicker;
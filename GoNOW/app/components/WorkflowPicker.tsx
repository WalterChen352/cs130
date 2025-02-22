import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import Select from 'react-select';

import { Workflow } from '../models/Workflow';

interface WorkflowPickerProps {
  workflows: Workflow[];
  onSelect: (workflow: Workflow) => void;
}

interface WorkflowOption {
  value: Workflow;  // Stores the full workflow object
  label: string;    // Display name in the dropdown
}

const WorkflowPicker: React.FC<WorkflowPickerProps> = ({
  workflows,
  onSelect
}) => { 
  const options: WorkflowOption[] = workflows.map((workflow) => ({
      value: workflow,
      label: workflow.name
    }))

  const handleChange = (selectedOption: WorkflowOption | null): void => {
    if(selectedOption){
      const selection = selectedOption.value;
      onSelect(selection);
    }
  }
  return (
    <Select
      onChange={handleChange} // Pass selected WorkflowOption
      options={options}
    />
  );
};

export default WorkflowPicker;
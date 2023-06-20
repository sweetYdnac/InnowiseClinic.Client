import { Autocomplete, TextField } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import IAutoCompleteItem from '../types/common/IAutoCompleteItem';

interface AutoCompleteProps {
    id: string;
    displayName: string;
    control: Control<any, any>;
    options: IAutoCompleteItem[];
    disabled?: boolean;
}

const AutoComplete: FunctionComponent<AutoCompleteProps> = ({ id, displayName, control, options, disabled = false }) => {
    const [open, setOpen] = useState(false);

    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => (
                <>
                    <Autocomplete
                        {...field}
                        defaultValue={options.find((option) => option.id === field.value) || null}
                        value={options.find((option) => option.id === field.value) || null}
                        onChange={(_e, value) => {
                            field.onChange(value?.id ?? null);
                            eventEmitter.emit(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${id}`);
                        }}
                        onInputChange={(_e, value) => {
                            eventEmitter.emit(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${id}`, value);
                        }}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                            eventEmitter.emit(`${EventType.OPEN_AUTOCOMPLETE} ${id}`);
                        }}
                        onClose={() => setOpen(false)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option: IAutoCompleteItem) => option.label}
                        options={options}
                        disabled={disabled}
                        autoHighlight
                        sx={{ m: 1, width: '75%' }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={displayName}
                                color={
                                    (fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || field.value)
                                        ? 'error'
                                        : 'success'
                                }
                                focused={(fieldState.error?.message?.length ?? 0) === 0 && (fieldState.isTouched || !!field.value)}
                                variant='standard'
                                helperText={
                                    (fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || field.value)
                                        ? fieldState.error?.message
                                        : ''
                                }
                                error={(fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || !!field.value)}
                            />
                        )}
                    />
                </>
            )}
        />
    );
};

export default AutoComplete;

import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import IAutoCompleteItem from '../types/common/IAutoCompleteItem';

interface AutoCompleteProps<T> {
    id: string;
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    disabled?: boolean;
    control: Control<any, any>;
    options: IAutoCompleteItem<T>[];
}

const AutoComplete = <T,>({ id, displayName, isTouched, errors, disabled = false, control, options }: AutoCompleteProps<T>) => {
    const [open, setOpen] = useState(false);

    return (
        <Controller
            name={id}
            control={control}
            render={({ field }) => (
                <>
                    <Autocomplete
                        {...field}
                        defaultValue={field.value ?? null}
                        value={field.value ?? null}
                        onChange={(_e, value: IAutoCompleteItem<T>) => {
                            field.onChange(value);
                            eventEmitter.emit(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${id}`);
                        }}
                        onInputChange={(_e, value) => {
                            eventEmitter.emit(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${id}`, value);
                        }}
                        disabled={disabled}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                            if (options.length === 0) {
                                eventEmitter.emit(`${EventType.OPEN_AUTOCOMPLETE} ${id}`);
                            }
                        }}
                        onClose={() => setOpen(false)}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        getOptionLabel={(option) => option.label}
                        options={options}
                        autoHighlight
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={displayName}
                                sx={{ m: 1, width: '75%' }}
                                color={(errors?.length ?? 0) > 0 && isTouched ? 'error' : 'success'}
                                focused={(errors?.length ?? 0) === 0 && isTouched}
                                variant='standard'
                                helperText={options.length === 0 ? 'No options' : errors}
                                error={(errors?.length ?? 0) > 0 && isTouched}
                            />
                        )}
                    />
                </>
            )}
        />
    );
};

export default AutoComplete;

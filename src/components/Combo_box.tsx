import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import IComboBoxItem from '../types/common/IComboBoxItem';

interface Combo_boxProps<T> {
    id: string;
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    disabled?: boolean;
    control: Control<any, any>;
    getData: () => Promise<IComboBoxItem<T>[]>;
    getDataOnInputChange?: (
        e: React.SyntheticEvent<Element, Event>,
        value: string
    ) => Promise<IComboBoxItem<T>[]>;
    onValueChange?: () => Promise<void>;
}

const Combobox = <T,>({
    id,
    displayName,
    isTouched,
    errors,
    disabled = false,
    control,
    getData,
    getDataOnInputChange,
    onValueChange,
}: Combo_boxProps<T>) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<IComboBoxItem<T>[]>([]);
    const [readOnly, setReadOnly] = useState(false);
    const loading = open && options.length === 0;

    const handleInputChange = (
        e: React.SyntheticEvent<Element, Event>,
        value: string
    ) => {
        getDataOnInputChange?.(e, value).then((data) => setOptions(data));

        if (options.length > 0) {
            setReadOnly(
                !options.some((item) =>
                    item.label.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    React.useEffect(() => {
        if (!loading) {
            return undefined;
        }

        getData().then((data) => {
            setOptions(data);
        });
    }, [getData, loading]);

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
                        onChange={(_e, value: IComboBoxItem<T>) => {
                            field.onChange(value);
                            onValueChange?.();
                        }}
                        onInputChange={handleInputChange}
                        disabled={disabled}
                        readOnly={readOnly}
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                        }
                        getOptionLabel={(option) => option.label}
                        options={options}
                        loading={loading}
                        autoHighlight
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={displayName}
                                sx={{ m: 1, width: '75%' }}
                                color={
                                    (errors?.length ?? 0) > 0 && isTouched
                                        ? 'error'
                                        : 'success'
                                }
                                focused={
                                    (errors?.length ?? 0) === 0 && isTouched
                                }
                                variant='standard'
                                helperText={
                                    options.length === 0 ? 'No options' : errors
                                }
                                error={(errors?.length ?? 0) > 0 && isTouched}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? (
                                                <CircularProgress
                                                    color='inherit'
                                                    size={20}
                                                />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                </>
            )}
        />
    );
};

export default Combobox;

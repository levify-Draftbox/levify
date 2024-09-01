import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import { X } from '@phosphor-icons/react';
import * as React from 'react';
import { forwardRef, useEffect } from 'react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface EmailOption {
    name?: string;
    email: string;
    photo?: string;
    disable?: boolean;
    fixed?: boolean;
    [key: string]: string | boolean | undefined;
}
interface GroupOption {
    [key: string]: EmailOption[];
}

interface EmailSelectorProps {
    value?: EmailOption[];
    defaultOptions?: EmailOption[];
    options: EmailOption[];
    placeholder?: string;
    loadingIndicator?: React.ReactNode;
    emptyIndicator?: React.ReactNode;
    delay?: number;
    triggerSearchOnFocus?: boolean;
    onSearch?: (value: string) => Promise<EmailOption[]>;
    onSearchSync?: (value: string) => EmailOption[];
    onChange?: (options: EmailOption[]) => void;
    maxSelected?: number;
    onMaxSelected?: (maxLimit: number) => void;
    hidePlaceholderWhenSelected?: boolean;
    disabled?: boolean;
    groupBy?: string;
    className?: string;
    badgeClassName?: string;
    selectFirstItem?: boolean;
    creatable?: boolean;
    commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
    inputClassName?: string,
    inputOnChange?: (_: string) => any,
    hideClearAllButton?: boolean;
}

export interface MultipleSelectorRef {
    selectedValue: EmailOption[];
    input: HTMLInputElement;
}

export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

function transToGroupOption(options: EmailOption[], groupBy?: string) {
    if (options.length === 0) {
        return {};
    }
    if (!groupBy) {
        return {
            '': options,
        };
    }

    const groupOption: GroupOption = {};
    options.forEach((option) => {
        const key = (option[groupBy] as string) || '';
        if (!groupOption[key]) {
            groupOption[key] = [];
        }
        groupOption[key].push(option);
    });
    return groupOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: EmailOption[]) {
    for (const [, value] of Object.entries(groupOption)) {
        if (value.some((option) => targetOption.find((p) => p.value === option.value))) {
            return true;
        }
    }
    return false;
}

const CommandEmpty = forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
    const render = useCommandState((state) => state.filtered.count === 0);

    if (!render) return null;

    return (
        <div
            ref={forwardedRef}
            className={cn('py-6 text-center text-sm', className)}
            cmdk-empty=""
            role="presentation"
            {...props}
        />
    );
});

CommandEmpty.displayName = 'CommandEmpty';

const EmailSelector = React.forwardRef<MultipleSelectorRef, EmailSelectorProps>(
    (
        {
            value,
            onChange,
            placeholder,
            defaultOptions: arrayDefaultOptions = [],
            options: arrayOptions,
            delay,
            onSearch,
            onSearchSync,
            loadingIndicator,
            emptyIndicator,
            maxSelected = Number.MAX_SAFE_INTEGER,
            onMaxSelected,
            hidePlaceholderWhenSelected,
            disabled,
            groupBy,
            className,
            inputClassName,
            inputOnChange,
            badgeClassName,
            creatable = false,
            triggerSearchOnFocus = false,
            commandProps,
            hideClearAllButton = false,
        }: EmailSelectorProps,
        ref: React.Ref<MultipleSelectorRef>,
    ) => {
        const inputRef = React.useRef<HTMLInputElement>(null);
        const [open, setOpen] = React.useState(false);
        const [onScrollbar, setOnScrollbar] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(false);
        const dropdownRef = React.useRef<HTMLDivElement>(null); // Added this

        const [selected, setSelected] = React.useState<EmailOption[]>(value || []);
        const [options, setOptions] = React.useState<GroupOption>(
            transToGroupOption(arrayDefaultOptions, groupBy),
        );
        const [inputValue, setInputValue] = React.useState('');
        const debouncedSearchTerm = useDebounce(inputValue, delay || 500);


        useEffect(() => {
            if (/[,]/.test(inputValue)) {
                const s = inputValue.split(/[,]/)
                let old = selected
                let l = s.pop()
                s.map(v => {
                    if (v == "") return
                    console.log(v);

                    old.push({ email: v, name: v })
                })
                setSelected(old)
                setInputValue(l as string)
            }
        }, [inputValue])

        React.useImperativeHandle(
            ref,
            () => ({
                selectedValue: [...selected],
                input: inputRef.current as HTMLInputElement,
                focus: () => inputRef.current?.focus(),
            }),
            [selected],
        );

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        const handleUnselect = React.useCallback(
            (option: EmailOption) => {
                const newOptions = selected?.filter((s) => s.email !== option.email);
                setSelected(newOptions);
                onChange?.(newOptions);
            },
            [onChange, selected],
        );

        const handleKeyDown = React.useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                const input = inputRef.current;
                if (input) {
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                        if (input.value === '' && selected.length > 0) {
                            const lastSelectOption = selected[selected.length - 1];
                            // If last item is fixed, we should not remove it.
                            if (!lastSelectOption.fixed) {
                                handleUnselect(selected[selected.length - 1]);
                            }
                        }
                    }
                    // This is not a default behavior of the <input /> field
                    if (e.key === 'Escape') {
                        input.blur();
                    }
                }
            },
            [handleUnselect, selected],
        );

        useEffect(() => {
            if (open) {
                document.addEventListener('mousedown', handleClickOutside);
                document.addEventListener('touchend', handleClickOutside);
            } else {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('touchend', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('touchend', handleClickOutside);
            };
        }, [open]);

        useEffect(() => {
            if (value) {
                setSelected(value);
            }
        }, [value]);

        useEffect(() => {
            /** If `onSearch` is provided, do not trigger options updated. */
            if (!arrayOptions || onSearch) {
                return;
            }
            const newOption = transToGroupOption(arrayOptions || [], groupBy);
            if (JSON.stringify(newOption) !== JSON.stringify(options)) {
                setOptions(newOption);
            }
        }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

        useEffect(() => {
            /** sync search */

            const doSearchSync = () => {
                const res = onSearchSync?.(debouncedSearchTerm);
                setOptions(transToGroupOption(res || [], groupBy));
            };

            const exec = async () => {
                if (!onSearchSync || !open) return;

                if (triggerSearchOnFocus) {
                    doSearchSync();
                }

                if (debouncedSearchTerm) {
                    doSearchSync();
                }
            };

            void exec();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

        useEffect(() => {
            /** async search */

            const doSearch = async () => {
                setIsLoading(true);
                const res = await onSearch?.(debouncedSearchTerm);
                setOptions(transToGroupOption(res || [], groupBy));
                setIsLoading(false);
            };

            const exec = async () => {
                if (!onSearch || !open) return;

                if (triggerSearchOnFocus) {
                    await doSearch();
                }

                if (debouncedSearchTerm) {
                    await doSearch();
                }
            };

            void exec();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

        const CreatableItem = () => {
            if (!creatable) return undefined;
            if (
                isOptionsExist(options, [{ email: inputValue, name: inputValue }]) ||
                selected.find((s) => s.value === inputValue)
            ) {
                return undefined;
            }

            const Item = (
                <CommandItem
                    value={inputValue}
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onSelect={(value: string) => {
                        if (selected.length >= maxSelected) {
                            onMaxSelected?.(selected.length);
                            return;
                        }
                        setInputValue('');
                        const newOptions = [...selected, { email: value, name: value }];
                        setSelected(newOptions);
                        onChange?.(newOptions);
                    }}
                >
                    {`Create "${inputValue}"`}
                </CommandItem>
            );

            // For normal creatable
            if (!onSearch && inputValue.length > 0) {
                return Item;
            }

            // For async search creatable. avoid showing creatable item before loading at first.
            if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
                return Item;
            }

            return undefined;
        };

        const EmptyItem = React.useCallback(() => {
            if (!emptyIndicator) return undefined;

            // For async search that showing emptyIndicator
            if (onSearch && !creatable && Object.keys(options).length === 0) {
                return (
                    <CommandItem value="-" disabled>
                        {emptyIndicator}
                    </CommandItem>
                );
            }

            return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
        }, [creatable, emptyIndicator, onSearch, options]);

        const [showFullInput, setShowFullInput] = React.useState(false)

        return (
            <Command
                ref={dropdownRef}
                {...commandProps}
                onKeyDown={(e) => {
                    handleKeyDown(e);
                }}
                className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
            >
                <div
                    className={cn(
                        'text-sm ring-offset-background px-3',
                        {
                            'cursor-text': !disabled && selected.length !== 0,
                        },
                        className,
                    )}
                    onClick={() => {
                        if (disabled) return;
                        inputRef.current?.focus();
                    }}
                >
                    <div className='flex'>
                        <div className="relative flex flex-wrap gap-2 flex-1">
                            {selected.map((option) => {
                                return (
                                    <div
                                        key={option.email}
                                        className={cn(
                                            emailRegex.test(option.email) ? "bg-input" : "bg-red-500/30",
                                            'text-[14px] h-[21px] px-3 !py-0 flex items-center rounded-full gap-1',
                                            'data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground',
                                            'data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground',
                                            badgeClassName,
                                        )}
                                        data-fixed={option.fixed}
                                        data-disabled={disabled || undefined}
                                    >
                                        {option.name || option.email}
                                        <button
                                            className={cn(
                                                'ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                                (disabled || option.fixed) && 'hidden',
                                            )}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUnselect(option);
                                                }
                                            }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onClick={() => handleUnselect(option)}
                                        >
                                            <X className="h-3 w-3 text-gray-500 dark:text-gray-200" />
                                        </button>
                                    </div>
                                );
                            })}
                            {/* Avoid having the "Search" Icon */}
                            <input
                                ref={inputRef}
                                value={inputValue}
                                disabled={disabled}
                                onChange={(e) => {
                                    setOpen(e.target.value != "");
                                    setInputValue(e.target.value)
                                    inputOnChange && inputOnChange(e.target.value)
                                }}
                                onBlur={() => {
                                    if (!onScrollbar) {
                                        setOpen(false);
                                    }
                                    setShowFullInput(false)

                                    if (inputValue != "" && inputValue != " ") {

                                        let notExist = true
                                        selected.map(e => {
                                            if (e.email == inputValue) {
                                                notExist = false
                                            }
                                        })

                                        if (notExist) {
                                            const newOptions = [...selected, { email: inputValue, name: inputValue }];
                                            setSelected(newOptions);
                                            onChange?.(newOptions);
                                            setInputValue("")
                                        }
                                    }

                                }}
                                onFocus={() => {
                                    triggerSearchOnFocus && onSearch?.(debouncedSearchTerm);
                                    setShowFullInput(true)
                                }}
                                placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
                                className={cn(
                                    'text-[15px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground !py-0 h-[20px]',
                                    {
                                        'w-full': !showFullInput || hidePlaceholderWhenSelected
                                    },
                                    inputClassName,
                                )}
                            />

                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSelected(selected.filter((s) => s.fixed));
                                onChange?.(selected.filter((s) => s.fixed));
                            }}
                            className={cn(
                                'right-0 h-[20px] w-[20px] p-0',
                                (hideClearAllButton ||
                                    disabled ||
                                    selected.length < 1 ||
                                    selected.filter((s) => s.fixed).length === selected.length) &&
                                'hidden',
                            )}
                        >
                            <X size={18} className='text-gray-500 dark:text-gray-400' />
                        </button>
                    </div>
                </div>
                <div className="relative">
                    {(open && arrayOptions.length != 0) && (
                        <CommandList
                            className="absolute top-1 z-10 w-full rounded-md  bg-popover text-popover-foreground shadow-md outline-none animate-in"
                            onMouseLeave={() => {
                                setOnScrollbar(false);
                            }}
                            onMouseEnter={() => {
                                setOnScrollbar(true);
                            }}
                            onMouseUp={() => {
                                inputRef.current?.focus();
                            }}
                        >
                            {isLoading ? (
                                <>{loadingIndicator}</>
                            ) : (
                                <>
                                    {EmptyItem()}
                                    {CreatableItem()}
                                    <CommandGroup>
                                        {(arrayOptions || []).map((email) => {
                                            return (
                                                <CommandItem
                                                    key={email.email}
                                                    value={email.email}
                                                    disabled={email.disable}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    onSelect={async () => {
                                                        if (selected.length >= maxSelected) {
                                                            onMaxSelected?.(selected.length);
                                                            return;
                                                        }
                                                        setInputValue('');

                                                        let notExist = true
                                                        selected.map(e => {
                                                            if (e.email == email.email) {
                                                                notExist = false
                                                            }
                                                        })

                                                        if (notExist) {
                                                            const newOptions = [...selected, email];
                                                            setSelected(newOptions);
                                                            onChange?.(newOptions);
                                                        }

                                                        setOpen(false)
                                                    }}
                                                    className={cn(
                                                        'cursor-pointer',
                                                        email.disable && 'cursor-default text-muted-foreground',
                                                    )}
                                                >
                                                    <div className='w-full flex gap-2 items-center'>
                                                        <img
                                                            className='w-[38px] h-[38px] rounded'
                                                            src={email.photo}
                                                        />
                                                        <div className='flex-1'>
                                                            {email.name || email.email}
                                                            {email.name && <h2 className='text-xs text-gray-500 dark:text-gray-300'>{email.email}</h2>}
                                                        </div>
                                                    </div>
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    )}
                </div>
            </Command>
        );
    },
);

EmailSelector.displayName = 'EmailSelector';
export default EmailSelector;

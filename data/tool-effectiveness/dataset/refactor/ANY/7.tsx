import { Input } from '@affine/admin/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@affine/admin/components/ui/select';
import { Switch } from '@affine/admin/components/ui/switch';
import { useCallback, useState } from 'react';

import { Textarea } from '../../components/ui/textarea';
import { isEqual } from './utils';

export type ConfigInputProps =
  | {
      field: string;
      desc: string;
      type: 'String';
      defaultValue: string;
      onChange: (key: string, value: string) => void;
    }
  | {
      field: string;
      desc: string;
      type: 'Number';
      defaultValue: number;
      onChange: (key: string, value: number) => void;
    }
  | {
      field: string;
      desc: string;
      type: 'Boolean';
      defaultValue: boolean;
      onChange: (key: string, value: boolean) => void;
    }
  | {
      field: string;
      desc: string;
      type: 'JSON';
      defaultValue: unknown;
      onChange: (key: string, value: unknown) => void;
    }
  | {
      field: string;
      desc: string;
      type: 'Enum';
      defaultValue: string;
      options: string[];
      onChange: (key: string, value: string) => void;
    };


const Inputs: Record<
  ConfigInputProps['type'],
  React.ComponentType<{
    defaultValue: string | number | boolean | unknown;
    onChange: (value?: string | number | boolean | unknown) => void;
    options?: string[];
  }>
> = {
  Boolean: function SwitchInput({ defaultValue, onChange }) {
    const handleSwitchChange = (checked: boolean) => {
      onChange(checked);
    };

    return (
      <Switch
        defaultChecked={defaultValue}
        onCheckedChange={handleSwitchChange}
      />
    );
  },
  String: function StringInput({ defaultValue, onChange }) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <Input
        type="text"
        minLength={1}
        defaultValue={defaultValue}
        onChange={handleInputChange}
      />
    );
  },
  Number: function NumberInput({ defaultValue, onChange }) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value));
    };

    return (
      <Input
        type="number"
        defaultValue={defaultValue}
        onChange={handleInputChange}
      />
    );
  },
  JSON: function ObjectInput({ defaultValue, onChange }) {
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      try {
        const value = JSON.parse(e.target.value);
        onChange(value);
      } catch {}
    };

    return (
      <Textarea
        defaultValue={JSON.stringify(defaultValue)}
        onChange={handleInputChange}
        className="w-full"
      />
    );
  },
  Enum: function EnumInput({ defaultValue, onChange, options }) {
    return (
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options?.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
};

export const ConfigRow = ({
  field,
  desc,
  type,
  defaultValue,
  onChange,
  ...props
}: ConfigInputProps) => {
  const [value, setValue] = useState(defaultValue);

  const isValueChanged = !isEqual(value, defaultValue);

  const onValueChange = useCallback(
    (value: string | number | boolean | unknown) => {
      onChange(field, value);
      setValue(value);
    },
    [field, onChange]
  );

  const Input = Inputs[type] ?? Inputs.JSON;

  return (
    <div
      className={`flex justify-between flex-grow space-y-[10px]
         ${type === 'Boolean' ? 'flex-row' : 'flex-col'}`}
    >
      <div className="text-base font-bold flex-3">{desc}</div>
      <div className="flex flex-col items-end relative flex-1">
        <Input
          defaultValue={defaultValue}
          onChange={onValueChange}
          {...props}
        />
        {isValueChanged && (
          <div className="absolute bottom-[-25px] text-sm right-0 break-words">
            <span
              className="line-through"
              style={{
                color: 'rgba(198, 34, 34, 1)',
                backgroundColor: 'rgba(254, 213, 213, 1)',
              }}
            >
              {JSON.stringify(defaultValue)}
            </span>{' '}
            =&gt;{' '}
            <span
              style={{
                color: 'rgba(20, 147, 67, 1)',
                backgroundColor: 'rgba(225, 250, 177, 1)',
              }}
            >
              {JSON.stringify(value)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    id?: string;
}

export function CustomCheckbox({ label, checked, onChange, id }: CheckboxProps) {
    return (
        <div className="flex items-center gap-8">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-16 h-16 rounded bg-input border-2 border-transparent checked:bg-primary checked:border-primary cursor-pointer appearance-none relative
        after:content-[''] after:absolute after:left-[4px] after:top[4px] after:w-[6px] after:h-[10px] 
        after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:opacity-0 
        checked:after:opacity-100 transition-all"
            />
            <label
                htmlFor={id}
                className="text-body cursor-pointer select-none"
                style={{ color: 'rgba(255,255,255,0.8)' }}
            >
                {label}
            </label>
        </div>
    );
}
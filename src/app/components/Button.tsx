import { ReactElement } from 'react';
import { IconType } from 'react-icons';

type buttonProps={
    Icon?: IconType,
    label: string,
    className?: string,
    icon?: string,
}

const Button = ({label,className}:buttonProps) => {
    return (
        <div>
            <button className={className} >
              
              {label}
            </button>
        </div>
    );
}

export default Button;
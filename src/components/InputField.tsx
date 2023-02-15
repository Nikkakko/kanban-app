import styled from 'styled-components';
import iconCross from '../assets/icon-cross.svg';

type InputFieldProps = {
  value: string;
  label?: string;
  name: string;
  placeholder: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  subtasks?: boolean;
  handleRemoveSubTask?: () => void;
  inputError?: boolean;
};

type styledProps = {
  name?: string;
  label?: string;
  subtasks?: boolean;
  inputError?: boolean;
};

const InputField = ({
  value,
  label,
  name,
  placeholder,
  type,
  onChange,
  subtasks,
  handleRemoveSubTask,
  inputError,
}: InputFieldProps) => (
  <>
    <FormGroup>
      {label && <Label htmlFor='input-field'>{label}</Label>}

      {!subtasks && (
        <Input
          type={type}
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
        />
      )}

      {subtasks && (
        <SubtaskDiv>
          <Input
            type={type}
            value={value}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            subtasks={subtasks}
            inputError={inputError}
          />
          {inputError && <EmptyError>Can't be empty</EmptyError>}
          <CrossImg src={iconCross} onClick={handleRemoveSubTask} />
        </SubtaskDiv>
      )}
    </FormGroup>
  </>
);

const FormGroup = styled.form<styledProps>`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SubtaskDiv = styled.div<styledProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 8px; */

  input {
    width: 92%;
  }

  position: relative;

  /* flex-direction: column; */
`;

const EmptyError = styled.p<styledProps>`
  position: absolute;
  top: 8px;
  right: 60px;

  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  /* Red */

  color: #ea5555;
`;

const CrossImg = styled.img<styledProps>`
  width: 16px;
  height: 16px;

  cursor: pointer;
`;

const Label = styled.label<styledProps>`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  text-transform: capitalize;

  margin-top: ${({ name }) => (name === 'subtasks' ? '0px' : '24px')};
`;
const Input = styled.input<styledProps>`
  background: ${({ theme }) => theme.navBarBackground};
  border: ${({ inputError }) =>
    inputError ? '1px solid #EA5555' : '1px solid rgba(130, 143, 163, 0.25);'};
  border-radius: 4px;
  padding: ${({ name }) =>
    name === 'description' ? '8px 25px 57px 16px' : '8px 16px'};
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: ${({ subtasks }) => (subtasks ? '12px' : '0px')};

  width: ${({ subtasks }) => (subtasks ? '90%' : '100%')};

  &:focus {
    outline: none;
  }

  &:hover {
    border: ${({ inputError }) =>
      inputError ? '1px solid #EA5555' : '1px solid #635FC7'};
    border-radius: 4px;
  }

  cursor: pointer;
`;
export default InputField;

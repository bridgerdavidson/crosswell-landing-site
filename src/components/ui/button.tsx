import { buttonClass, type ButtonVariant } from "./button-styles";

export function Button({
  variant = "primary",
  type = "button",
  className,
  ...props
}: { variant?: ButtonVariant } & React.ComponentProps<"button">) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

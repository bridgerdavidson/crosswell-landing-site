import { buttonClass, type ButtonVariant } from "./button-styles";

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: { variant?: ButtonVariant } & React.ComponentProps<"a">) {
  return <a className={buttonClass(variant, className)} {...props} />;
}

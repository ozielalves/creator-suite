/**
 * Storybook stories — colocated with the component as the design-engineering contract.
 * Full Storybook config can be added with `npx storybook@latest init` locally.
 */
import { Button } from "./Button";

export default { title: "UI/Button", component: Button };

export const Primary = () => <Button>Primary</Button>;
export const Secondary = () => <Button variant="secondary">Secondary</Button>;
export const Loading = () => <Button isLoading>Loading</Button>;
export const Destructive = () => <Button variant="destructive">Delete</Button>;

import { CreateMonitorForm } from "./monitor-create-dialog";

export default function Page() {
	return (
		<div className="flex items-center justify-between">
			<h1>Monitors</h1>
			<CreateMonitorForm />
		</div>
	);
}

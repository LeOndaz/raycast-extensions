import { Action, Clipboard, Icon, Toast, showToast } from "@raycast/api";

import { useCurrentApplicationContext } from "@/context/current-application";
import { getOtpSecret } from "@/lib/dcli";
import { VaultCredential } from "@/types/dcli";

type Props = {
  item: VaultCredential;
};

export default function TotpActions({ item }: Props) {
  const { currentApplication } = useCurrentApplicationContext();
  const copyTotp = () => copy(item.id);
  const pasteTotp = () => paste(item.id);
  const hasTotp = item.otpSecret !== undefined;

  if (!hasTotp) return null;

  return (
    <>
      <Action title="Copy TOTP" onAction={copyTotp} icon={Icon.Clipboard} shortcut={{ modifiers: ["cmd"], key: "t" }} />
      <Action
        title={currentApplication ? `Paste TOTP into ${currentApplication.name}` : "Paste TOTP"}
        onAction={pasteTotp}
        icon={Icon.Window}
        shortcut={{ modifiers: ["cmd", "shift"], key: "t" }}
      />
    </>
  );
}

async function copy(id: string) {
  const toast = await showToast(Toast.Style.Animated, "Getting TOTP code");
  try {
    const { otp, expireIn } = await getOtpSecret(id);
    await Clipboard.copy(otp, { concealed: true });

    toast.title = "Copied to Clipboard";
    toast.message = `Expires in ${expireIn} seconds`;
    toast.style = Toast.Style.Success;
  } catch (error) {
    toast.message = "Failed to get TOTP";
    toast.style = Toast.Style.Failure;
  }
}

async function paste(id: string) {
  const toast = await showToast(Toast.Style.Animated, "Getting TOTP code");
  try {
    const { otp } = await getOtpSecret(id);
    await Clipboard.paste(otp);
  } catch (error) {
    toast.message = "Failed to get TOTP";
    toast.style = Toast.Style.Failure;
  }
}

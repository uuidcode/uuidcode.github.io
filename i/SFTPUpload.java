import java.io.IOException;

import javax.swing.JOptionPane;

import com.sshtools.j2ssh.SftpClient;
import com.sshtools.j2ssh.SshClient;
import com.sshtools.j2ssh.authentication.AuthenticationProtocolState;
import com.sshtools.j2ssh.authentication.PasswordAuthenticationClient;
import com.sshtools.j2ssh.transport.HostKeyVerification;
import com.sshtools.j2ssh.transport.publickey.SshPublicKey;

public class SFTPUpload {
	private SshClient client = null;
	private PasswordAuthenticationClient auth = null;
	private SftpClient sftp = null;

	public SFTPUpload(String server, String user, String pwd) throws Exception {
		try {
			if (server == null || user == null || pwd == null) {
				System.out.println("Parameter is null!");
			}
			client = new SshClient();
			client.setSocketTimeout(2000);
			client.connect(server, new HostKeyVerification() {
				public boolean verifyHost(String name, SshPublicKey key) {
					// Verify the host somehow???
					return true;
				}
			});

			auth = new PasswordAuthenticationClient();
			auth.setUsername(user);
			auth.setPassword(pwd);
			int result = client.authenticate(auth);
			if (result != AuthenticationProtocolState.COMPLETE) {
				throw new Exception("Login to " + server + ":22" + user + "/"
						+ pwd + " failed");
			}
			sftp = client.openSftpClient();
		} catch (Exception e) {
			System.out.println(e);
			throw e;
		}
	}

	public boolean put(String path) throws Exception {
		boolean rtn = false;
		try {
			if (sftp != null) {
				sftp.put(path);
				rtn = true;
			}
		} catch (Exception e) {
			System.out.println(e);
		}
		return rtn;
	}

	public boolean get(String srcFile, String destFile) throws Exception {
		boolean rtn = false;
		try {
			if (sftp != null) {
				if (destFile == null)
					sftp.get(srcFile);
				else
					sftp.get(srcFile, destFile);
				rtn = true;
			}
		} catch (Exception e) {
			System.out.println(e);
		}
		return rtn;
	}

	public boolean lcd(String path) throws Exception {
		boolean rtn = false;
		try {
			if (sftp != null) {
				sftp.lcd(path);
				rtn = true;
			}
		} catch (Exception e) {
			System.out.println(e);
		}
		return rtn;
	}

	public boolean cd(String path) throws Exception {
		boolean rtn = false;
		try {
			if (sftp != null) {
				sftp.cd(path);
				rtn = true;
			}
		} catch (Exception e) {
			System.out.println(e);
		}
		return rtn;
	}

	public String pwd() throws Exception {
		String rtnStr = null;
		try {
			if (sftp != null) {
				rtnStr = sftp.pwd();
			}
		} catch (Exception e) {
			System.out.println(e);
		}
		return rtnStr;
	}

	public boolean chmod(int permissions, String path) throws Exception {
		boolean rtn = false;
		try {
			if (sftp != null) {
				sftp.chmod(permissions, path);
				rtn = true;
			}
		} catch (Exception e) {
			System.out.println(e);
		}
		return rtn;
	}

	public boolean isClosed() throws Exception {
		boolean rtn = false;
		try {
			if (sftp != null)
				rtn = sftp.isClosed();
		} catch (Exception e) {
			System.out.println(e);
		}
		return rtn;
	}

	public boolean logout() throws Exception {
		boolean rtn = false;
		try {
			if (sftp != null)
				sftp.quit();
			if (client != null)
				client.disconnect();
			rtn = true;
		} catch (Exception e) {
			System.out.println(e);
		}
		return rtn;
	}

	public static void main(String[] args) {
		try {
			SFTPUpload jsftp = new SFTPUpload("w-173.cafe24.com",
					"songsungkyun", "chopsuey");
			boolean test = jsftp
					.cd("/home/hosting_users/songsungkyun/www/images");
			System.out.println(jsftp.pwd());
			boolean test2 = jsftp
					.put("D:\\interpark\\shopping\\testspace\\Image\\src\\SFTPUpload.java");
			boolean isClosed = jsftp.isClosed();
			boolean test3 = jsftp.logout();
			JOptionPane.showConfirmDialog(null, "OK");
		} catch (Exception e) {
			JOptionPane.showConfirmDialog(null, e.getMessage());
		}
		System.exit(0);
	}
}
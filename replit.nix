{ pkgs }: {
	deps = [
        pkgs.python310
		pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.replitPackages.jest
	];
}
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerInteractEvent;
import org.bukkit.event.EventHandler;
import org.bukkit.event.block.Action;
import org.bukkit.entity.Player;
import org.bukkit.Material;
import org.bukkit.entity.WitherSkull;

public class plugin extends JavaPlugin implements Listener {

	public void onEnable() {
		getServer().getPluginManager().registerEvents(this, this);
	}

	@EventHandler
	public void onRightClick(PlayerInteractEvent event)	{
		if (event.getAction() == Action.RIGHT_CLICK_AIR || event.getAction() == Action.RIGHT_CLICK_BLOCK) {
			Player player = event.getPlayer();
			if (player.getItemInHand().getType() == Material.BLAZE_ROD) {
				WitherSkull witherskull = (WitherSkull) player.launchProjectile(WitherSkull.class);
				witherskull.setShooter(player);
				witherskull.setVelocity(player.getLocation().getDirection().multiply(1.8));
				witherskull.setIsIncendiary(true);
				witherskull.setYield(7.0F);
			}
		}
	}

}
